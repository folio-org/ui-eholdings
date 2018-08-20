pipeline {
  agent none
  stages {
    stage('Install') {
      agent {
        docker 'circleci/node:9'
      }
      steps {
        sh 'yarn install'
        stash includes: 'node_modules/', name: 'node_modules'
      }
    }
    stage('Verify') {
      parallel {
        stage('Lint JS') {
          agent {
            docker 'circleci/node:9'
          }
          steps {
            unstash 'node_modules'
            sh 'yarn eslint --max-warnings=0'
          }
        }
        stage('Lint CSS') {
          agent {
            docker 'circleci/node:9'
          }
          steps {
            unstash 'node_modules'
            sh 'yarn stylelint'
          }
        }
      }
    }
  }
}
