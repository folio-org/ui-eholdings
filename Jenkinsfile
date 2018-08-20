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
      }
    }
    stage('Verify') {
      parallel {
        stage('Lint JS') {
          steps {
            bat "yarn eslint --max-warnings=0"
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
