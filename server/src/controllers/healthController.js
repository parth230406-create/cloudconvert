const os = require('os');

module.exports = {
  check: (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      memory: { total: `${Math.round(os.totalmem() / 1048576)}MB`, free: `${Math.round(os.freemem() / 1048576)}MB` },
      nodeVersion: process.version
    });
  }
};