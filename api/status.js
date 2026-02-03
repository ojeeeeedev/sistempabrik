import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const monitors = [
    { id: 'inventory', url: 'https://inventory.utamakorindah.com' },
    { id: 'cctv', url: 'https://cctv.utamakorindah.com' },
  ];

  const { CF_API_TOKEN, CF_ACCOUNT_ID, BLOB_READ_WRITE_TOKEN } = process.env;
  
  // Parallel checks
  const results = await Promise.all(monitors.map(async (monitor) => {
    let status = 'operational'; // default
    let errorMsg = null;
    let method = 'http_check';

    // 1. Cloudflare API Check - Priority for deep infrastructure status
    if (CF_API_TOKEN && CF_ACCOUNT_ID) {
        try {
            // Search for tunnels. If they share an ID, we check if ANY matching tunnel is unhealthy.
            const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/tunnels?name=${monitor.id}`, {
                headers: { 
                  'Authorization': `Bearer ${CF_API_TOKEN}`, 
                  'Content-Type': 'application/json' 
                }
            });
            const cfData = await cfRes.json();
            
            if (cfData.success && cfData.result && cfData.result.length > 0) {
                // If multiple tunnels match (or share ID), check if the relevant one is healthy
                const tunnel = cfData.result[0];
                if (tunnel.status !== 'healthy') {
                    status = 'outage';
                    errorMsg = `Tunnel Infrastructure: ${tunnel.status.toUpperCase()}`;
                    method = 'cf_api';
                }
            }
        } catch (e) {
            console.error("Cloudflare API Verification Failed:", e);
        }
    }

    // 2. HTTP Check (Primary Request)
    // If we haven't already marked it as an outage via API...
    if (status === 'operational') {
        try {
            const response = await fetch(monitor.url, {
                method: 'GET',
                // Set a timeout to avoid hanging
                signal: AbortSignal.timeout(8000) 
            });

            // Always read text to check for specific error pages (like 1033)
            // regardless of status code (as 1033 often comes with 530)
            const text = await response.text();
            
            if (text.includes('Error 1033') || text.includes('Argo Tunnel error')) {
                status = 'outage';
                errorMsg = 'Argo Tunnel Error (1033)';
            } else if (response.status >= 520 && response.status <= 530) {
                status = 'outage';
                errorMsg = `Cloudflare Error ${response.status}`;
            } else if (!response.ok) {
                 if (response.status >= 500) {
                     status = 'outage';
                     errorMsg = `Server Error ${response.status}`;
                 }
            }
        } catch (error) {
            status = 'outage';
            errorMsg = error.message || 'Connection Failed';
        }
    }

    return {
      id: monitor.id,
      name: monitor.id === 'inventory' ? 'Inventory System' : 'CCTV System',
      url: monitor.url,
      status,
      error: errorMsg,
      checkedAt: new Date().toISOString()
    };
  }));

  // Format as object for frontend
  const responseData = results.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  // --- DATABASE (BLOB) LOGGING ---
  let history = [];
  try {
    if (BLOB_READ_WRITE_TOKEN) {
        // 1. Fetch existing history
        // We use 'list' to find the file because the URL might change if we didn't use fixed URLs?
        // With addRandomSuffix: false, the URL *should* be predictable if we knew the base,
        // but 'list' is safer to find it dynamically.
        const { blobs } = await list({ prefix: 'status-history.json', limit: 1, token: BLOB_READ_WRITE_TOKEN });
        
        if (blobs.length > 0) {
            // Found it, download content
            // Add a cache-busting param to ensure we get fresh data
            const historyRes = await fetch(blobs[0].url + `?t=${Date.now()}`);
            if (historyRes.ok) {
                history = await historyRes.json();
            }
        }

        // 2. Throttling: Only log if last entry is > 58 minutes old
        // We look at the last entry in the history array.
        const lastEntry = history.length > 0 ? history[history.length - 1] : null;
        const now = new Date();
        const shouldLog = !lastEntry || (now.getTime() - new Date(lastEntry.timestamp).getTime() > 58 * 60 * 1000);

        if (shouldLog) {
            // Create new log entries from the current check
            const newEntries = Object.values(responseData).map(d => ({
                timestamp: now.toISOString(),
                system: d.name,
                status: d.status,
                error: d.error
            }));

            // Append and Trim (Keep last 2000 entries ~ 48-100 hours depending on check freq)
            history = [...history, ...newEntries].slice(-2000);

            // 3. Write back to Blob
            await put('status-history.json', JSON.stringify(history), { 
                access: 'public', 
                addRandomSuffix: false, // Overwrite
                token: BLOB_READ_WRITE_TOKEN
            });
        }
    }
  } catch (e) {
      console.error("Vercel Blob Operation Failed:", e);
      // We don't fail the request, just log the error.
  }

  // Return both current status and the history log
  res.status(200).json({ current: responseData, history });
}
