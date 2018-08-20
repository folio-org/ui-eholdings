pipeline {
    agent { docker { image 'node:6.3' } }
    environment { 
      HOME="." 
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm install'
                sh 'npm eslint'
            }
        }
    }
}
