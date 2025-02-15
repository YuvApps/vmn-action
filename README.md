[![vmn: automatic versioning](https://img.shields.io/badge/vmn-automatic%20versioning-blue)](https://github.com/final-israel/vmn)

# vmn based automatic versioning action
Action for Git tag-based automatic `Semver`-compliant versioning utilizing the `vmn` utility    

This action was built for basic use of the `vmn` utility. 

If you want to use `vmn` in a more advanced way, visit its official GitHub page and give it a star:

https://github.com/final-israel/vmn

## Usage
```yaml
- id: foo
  uses: progovoy/vmn-action@vmna_0.1.9
  with:
    stamp-mode: {major, minor, patch}   # Default value is "patch"
    release-candidate: <Boolean>        # Set either release-candidate (will create patch release-candidate if this is the first release-candidate) 
                                        #   or stamp-mode for normal stamping
    release: <Boolean>                  # Set true only when you want to release the release-candidate version  
    prerelease-name: <PRERELEASE_NAME>  # Default value is "rc"
    app-name: <APP_NAME>                # Must be provided

- name: Use the output from vmn action
  run: |
    echo "${{steps.foo.outputs.verstr}}"
```

## Full Dummy Example Without Release Candidate Mode
```yaml
name: test

on:
  workflow_dispatch:
    inputs:
      version_type:
        type: choice
        description: Release mode
        options:
        - patch
        - minor
        - major
        required: true
      app_name:
        description: App name
        required: true

jobs:
  build_pkg:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2.5.0

    - id: foo
      uses: progovoy/vmn-action@vmna_0.1.9
      with:
        stamp-mode: ${{inputs.version_type}}
        app-name: ${{inputs.app_name}}
     
    - name: Use the output from vmn action
      run: |
        echo "${{steps.foo.outputs.verstr}}"

 ```

 ## Full Dummy Example With Release Candidate Mode
```yaml
name: test

on:
  workflow_dispatch:
    inputs:
      prerelease_name:
        description: Prerelease name
      app_name:
        description: App name
        required: true

jobs:
  build_pkg:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2.5.0

    - id: foo
      uses: progovoy/vmn-action@vmna_0.1.9
      with:
        release-candidate: true
        release: false
        prerelease-name: ${{inputs.prerelease_name}}
        app-name: ${{inputs.app_name}}
     
    - name: Use the output from vmn action
      run: |
        echo "${{steps.foo.outputs.verstr}}"

 ```
 
