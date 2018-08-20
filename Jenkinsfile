pipeline {
  agent { 
    docker { 
      image 'node:9' 
    } 
  }
  stages {
    stage('Checkout') {
      steps {
        sh 'yarn install'
      }
    }
  }
}
