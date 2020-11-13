const shell = require('shelljs'),
    kebabCase = require('kebab-case');
const colors = require('colors');

function shellExec(args, echo) {
    const cmd = args.join(' ');
    if (echo) {
        console.log(cmd.green);
    }
    shell.exec(cmd);
    return cmd;
}

function execAsync(cmd, args, echo) {
    const spawn = require('child-process-promise').spawn;
    if (echo) {
        console.log(`${cmd} ${args.join(' ')}`.green);
    }
    const promise = spawn(cmd, args);
    promise.childProcess.stderr.pipe(process.stdout);
    return promise;
}

function tippecanoe(inputFiles=[], cmd, params, options = {}) {
    function quotify(s) {
        if (typeof s === 'object') {
            s = JSON.stringify(s);
        } else {
            s = String(s);
        }
        return !options.async && s.match(/[ "[]/) ? `'${s}'` : s;
    }
    function makeParam(key, value) {
        if (Array.isArray(value)) {
            return value.map(v => makeParam(key, v)).join(' ');
        }
        if (value === false) { // why do we do this?
            return '';
        }
        const short = key.length <= 2;
        const param = short ? `-${key}` : `--${kebabCase(key)}`;
        if (value === true) {
            return param;
        }
        return short ? `${param}${quotify(value)}` : `${param}=${quotify(value)}`
    }
    let paramStrs = Object.keys(params)
        .map(k => makeParam(k, params[k]))
        .filter(Boolean)
    inputFiles = !Array.isArray(inputFiles) ? [inputFiles] : inputFiles;

    // const cmd = `tippecanoe ${paramsStr} ${layerFiles.map(quotify).join(' ')}`;
    const args = [cmd, ...paramStrs, ...inputFiles.map(quotify)];
    if (options.async) {
        return execAsync(cmd, args, options.echo);
    } else {
        return shellExec(args, options.echo);
    }
}

module.exports = tippecanoe;
const call = (cmd, async) => (layerFiles, params, options = {}) => tippecanoe(layerFiles, cmd, params, {...options, async});
tippecanoe.tippecanoeSync = call('tippecanoe', false);
tippecanoe.tippecanoeAsync = call('tippecanoe', true);
tippecanoe.tilejoin = call('tile-join', false);
tippecanoe.tilejoinAsync = call('tile-join', true);