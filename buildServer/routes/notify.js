const router = require('express').Router();

// зарегистрировать агента
router.post('/notify-agent', (req, res) => {
  const { body } = req;
  const { port, host } = body;
  // TODO: зарегистрировать агента
})

// сохранить результаты сборки
router.post('/notify-build-result', (req, res) => {
  const { body } = req;
  const { id, status, log } = body;
  // TODO: сохранить результаты сборки в базе?
});

module.exports = router;
