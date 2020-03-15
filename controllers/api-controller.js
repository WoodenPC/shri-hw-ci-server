class ApiController {
  constructor(yandexApiService) {
    this.yandexApiSvc = yandexApiService;
  }

  
}

const instance = new ApiController(null);

module.exports = instance;