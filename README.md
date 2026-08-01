# setup-acts

GitHub Action to setup Atian-Tools

Install [ate47/atian-cod-tools](https://github.com/ate47/atian-cod-tools) to your workflow.

**Usage**

```yml
    - name: Install Atian Tools
      uses: ate47/setup-acts@v1
      with:
        # Atian Tools version to install, latest for the latest version, latest_build 
        # for the latest prerelease build.
        # Default: latest
        version: latest

        # Download the hash index with Atian Tools
        # Default: false
        hashindex: false
```

## Options

### `version`

Atian tools version to install.

Special values

- `latest`: Latest version
- `latest_build`: Latest compiled code (pre release)

### `hashindex`

Download the hash index from [ate47/HashIndex](https://github.com/ate47/HashIndex).

