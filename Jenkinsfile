pipeline {
    agent { 
      docker { 
        image 'circleci/node:9' 
      } 
    }
    dir("${env.WORKSPACE}/project") {
      stages {
          stage('build') {
              steps {
                  sh 'yarn install'
                  sh 'yarn run eslint'
              }
          }
      }
    }
}
