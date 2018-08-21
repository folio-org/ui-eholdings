pipeline {
  agent { 
    docker { 
      image 'circleci/node:9' 
    } 
  }
  stages {
    stage('build') {
      steps {
        sh 'yarn install'
        sh 'yarn run eslint'
      }
    }
  }
}
