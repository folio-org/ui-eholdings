pipeline {
  agent none
  stages {
    stage('Fetch dependencies') {
      agent {
        docker 'circleci/node:9'
      }
      steps {
        sh 'yarn'
        stash includes: 'node_modules/', name: 'node_modules'
      }
    }
    stage('Lint JS') {
      agent {
        docker 'circleci/node:9'
      }
      steps {
        unstash 'node_modules'
        sh 'yarn eslint'
      }
    }
  }
}
