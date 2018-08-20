pipeline {
    agent { docker { image 'node:6.3' } }
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
