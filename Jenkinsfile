node {
  stage('Checkout') {
    checkout([
      $class: 'GitSCM',
      branches: scm.branches,
      extensions: scm.extensions + [[$class: 'RelativeTargetDirectory',
                                              relativeTargetDir: 'project'],
                                    [$class: 'SubmoduleOption',
                                              disableSubmodules: false,
                                              parentCredentials: false,
                                              recursiveSubmodules: true,
                                              reference: '',
                                              trackingSubmodules: false]],
      userRemoteConfigs: scm.userRemoteConfigs
    ])
  }
  stage('Test') {
    echo 'Building....'
  }
}
