let notifier = require('node-notifier')
let fs = require('fs')
let fsp = require('fs').promises


let downloads = []

let readDownloads = () => {
    fs.readdir(`../../../../Downloads`, (err, data) => {
        if (err) throw err

        downloads = data
    })
}


let mvFile = (newP, oldF) => {

    let newPdir = newP.split('/')

    if (newPdir.length > 0) {
        let fin = newPdir.pop()
        if (!fin.includes('.')) {
            let nc3 = new notifier.NotificationCenter()
            nc3.notify({
                title: 'invalid path',
                message: 'sorry your path was invalid please try again',
            },
                (err, response, metadata) => {
                    if (err) throw err

                    notif()
                }
            )
            return
        }
        newPdir = newPdir.join('/')
    } else {
        newPdir = null
    }

    console.log(newPdir, newP, oldF)

    if (fs.existsSync(`../../../${newPdir}`)) {
        fs.renameSync(`../../../../Downloads/${oldF}`, `../../../${newP}`)
    } else {
        console.log('mkdir')
        fs.mkdirSync(`../../../${newPdir}`)
        fs.renameSync(`../../../../Downloads/${oldF}`, `../../../${newP}`)
    }
}

let notif = (file, isFile, isDir) => {
    let nc = new notifier.NotificationCenter()

    let trueAnswer = 'most definitely'

    nc.notify({
        title: 'download detected',
        message: `there has been a new download, ${file}, do you wish to move it from the downloads folder?`,
        sound: 'funk',
        actions: trueAnswer,
        // 'wait': true,
    },
        (err, response, metadata) => {
            if (err) throw err;
            console.log(metadata);

            if (metadata.activationValue !== trueAnswer) {
                return; // No need to continue
            }

            nc.notify(
                {
                    title: 'enter path',
                    message: 'enter directory from desktop with desired filename',
                    sound: 'Funk',
                    // case sensitive
                    reply: true,
                    wait: 100,
                },
                (err, response, metadata) => {
                    if (err) throw err;
                    console.log(metadata);
                }
            );

            console.log(`input dir ${file}`)

            nc.on('replied', (obj, options, metadata) => {

                console.log(`object: ${JSON.stringify(obj)}`)

                console.log(`file on event listener : ${file}`)
                let fullPath = metadata.activationValue

                if (isFile) {

                    mvFile(fullPath, file)

                } else {
                    let nc2 = new notifier.NotificationCenter()
                    nc2.notify({
                        title: 'unable to move directory',
                        message: 'sorry but download was not a single file, program is unable to move this yet'
                    })
                }

            })
        }
    )

}


readDownloads()

let checkDownload = () => {

    let isFile, isDir, finFile

    fs.readdir('../../../../Downloads', (err, data) => {
        if (err) throw err


        if (data.length > downloads.length) {
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                if (downloads.includes(data[i])) {
                } else {
                    finFile = data[i]

                    fsp.readFile(`../../../../Downloads/${data[i]}`, 'utf8')
                        .then(() => {
                            fsp.stat(`../../../../Downloads/${data[i]}`, (err, stats) => {
                                if (err) throw err

                                isFile = stats.isFile()
                                isDir = stats.isDirectory()

                                return isFile, isDir

                            }).then((isFile, isDir) => {
                                // downloads = data

                                notif(finFile, isFile, isDir)
                            })
                                .catch(err => { console.log(err) })
                        })
                        .catch(err => { console.log(err) })

                }
            }
        }

        downloads = data

    })

}


setInterval(() => {
    checkDownload()
}, 1000)