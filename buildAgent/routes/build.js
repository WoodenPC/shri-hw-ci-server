const router = require('express').Router();

const svcContainer = require('../services/serviceContainer');

// запустить сборку
router.post('/build', async (req, res) => {
  const { body } = req;
  const { buildId, repoAddress, commitHash, buildCommand } = body;
  const buildSvc = svcContainer.getService('BuildService');
  buildSvc.setParams({ buildId, repoAddress, commitHash, buildCommand });
  try {
    const processResult = await buildSvc.processRepository();
    console.log('build processing finished');
    const apiSvc = svcContainer.getService('ApiService');

    const notifyRes = await apiSvc.notifyBuildResult({
      buildId,
      buildStatus: processResult.buildStatus,
      buildLog: processResult.buildLog,
      duration: processResult.duration
    });

    console.log('notify result', notifyRes.data);

    if (notifyRes.status !== 200) {
      res.status(502).send('Build server not responded');
      return;
    }
  } catch(e) {
    res.status(500).send(`Cannot process repository ${e.toString()}`);
    return;
  }

  return res.sendStatus(200);
})

module.exports = router;