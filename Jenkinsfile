pipeline {
  agent docker:'node:6.3'
  stages {
    stage('build') {
      sh 'npm --version'
      sh 'npm install'
    }
    stage ('test') {
      sh 'npm test'
    }
  }
}