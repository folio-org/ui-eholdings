pipeline {
    agent { 
      docker { 
        image 'circleci/node:9' 
        args '-v=/etc/passwd:/etc/passwd'
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
