const { spawn } = require('child_process');

class BuildService {
  constructor() {
    this.buildCommand = '';
  }

  setParams = ({ buildCommand }) => {
    this.buildCommand = buildCommand;
  }

  runTests = () => {
    // todo run 
    return new Promise((resolve, reject) => {

    })
  }
  
  runBuild = () => {
    // tood spawn build process
    return new Promise((resolve, reject) => {

    })
  }
}