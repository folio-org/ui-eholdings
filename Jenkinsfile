pipeline {
    agent { docker { image 'node:9' } }
    environment { 
      npm_config_cache='npm-cache'
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
