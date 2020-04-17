class AgentsService {
  constructor() {
    this.agents = new Set();
  }

  // зарегистрировать агента
  register = ({ host, port }) => {
    this.agents.add(`${host}:${port}`);
  }

  // отрегестрировать агента
  unregister = ({ host, port }) => {
    this.agents.delete(`${host}:${port}`);
  }
}