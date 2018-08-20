pipeline {
  agent { 
    docker { 
      image 'circleci/node:9' 
    } 
  }
  stages {
    stage('Checkout') {
      steps {
        sh 'yarn install'
        stash includes: 'node_modules/', name: 'node_modules'
      }
    }
    stage('Verify') {
      parallel {
        stage('Lint JS') {
          steps {
            sh "yarn eslint --max-warnings=0"
          }
        }
        stage('Lint CSS') {
          steps {
            sh "yarn stylelint"
          }
        }
      }
    }
  }
}
