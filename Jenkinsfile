pipeline {
  agent {
    docker 'circleci/node:9'
  }
  stages {
    stage('Fetch dependencies') {
      steps {
        sh 'yarn'
        stash includes: 'node_modules/', name: 'node_modules'
      }
    }
    stage('Lint JS') {
      steps {
        unstash 'node_modules'
        sh 'yarn eslint'
      }
    }
  }
}
