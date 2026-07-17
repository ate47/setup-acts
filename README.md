# setup-acts

GitHub Action to setup Atian-Tools

Install [ate47/atian-cod-tools](https://github.com/ate47/atian-cod-tools) to your workflow.

**Usage**

```yml
    - name: Install atian tools
      uses: ate47/setup-acts@v1
```

## Options

### `version`

Atian tools version to install.

Special values

- `latest`: Latest version
- `latest_build`: Latest compiled code (pre release)

### `hashindex`

Download the hash index from [ate47/HashIndex](https://github.com/ate47/HashIndex).

