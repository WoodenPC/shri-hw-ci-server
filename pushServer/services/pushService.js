const webPush = require('web-push');

const statuses = {
  'Success': 'Успешно',
  'Fail': 'Неуспешно',
  'InProgress': 'В процессе',
  'Waiting': 'В ожидании',
  'Canceled': 'Отменена'
}

class PushService {
  static instance;
  static getInstance() {
    if (!PushService.instance) {
      PushService.instance = new PushService();
    }
    return PushService.instance;
  }

  constructor() {
    this.subscriptions = new Set();
  }

  push(buildNumber, status = 'Success') {
    console.log('pushing notifications');
    this.subscriptions.forEach((sub) => {
      webPush.sendNotification(sub, JSON.stringify({ title: `Сборка ${buildNumber} завершена со статусом ${statuses[status]}` }))
        .catch(() => { this.subscriptions.delete(sub); })
    })
  }

  subscribe(subscribtion) {
    console.log('subscribe', subscribtion);
    this.subscriptions.add(subscribtion);
  }
}

function getPushService() {
  return PushService.getInstance();
}

module.exports = { getPushService };