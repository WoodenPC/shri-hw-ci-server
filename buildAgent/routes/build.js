const router = require('express').Router();

// запустить сборку
router.post('/build', (req, res) => {
  const { body } = req;
  const { id, repoName, commitHash, buildCommand } = body;
  // TODO: запустить сборку :)
  // обратиться к гит сервису 
})

module.exports = router;