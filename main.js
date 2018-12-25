'use strict';

var fs = require('fs'),
    readline = require('readline'),
    ui = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    }),
    args = process.argv,
    engine = require('./engine.js');

if(args.length < 3)
{
    console.log('usage: node main.js test.json');
    process.exit(0);
}

if(fs.existsSync(args[2]))
{
    try
    {
        var buffer = fs.readFileSync(args[2]);
        var data = buffer.toString();
        var model = JSON.parse(data);

        console.log('  ', model.Title);
        console.log('  ', model.Author);
        console.log('  ', model.Preamble);
        console.log();

        ui.prompt();

        ui.on('line', function(line)
        {
            var response = engine.handle(model, line);

            if(response != '')
            {
                console.log(response);
            }

            if(model.quit)
            {
                process.exit(0);
            }
            else
            {
                console.log();
                ui.prompt();
            }
        });
    }
    catch (e)
    {
        console.log('error: ' + e.message);
        process.exit(0);
    }
}
else
{
    console.log('not found: ' + args[2]);
    process.exit(0);
}
