pipeline {
    agent { docker { image 'node:9' } }
    environment { 
      HOME="." 
    }
    stages {
        stage('build') {
            steps {
                sh 'yarn install'
                sh 'yarn eslint'
            }
        }
    }
}
