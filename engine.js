'use strict';

exports.handle = function(model, line)
{
    var args = line.trim().split(/\s+/);

    if(args.length == 0)
    {
        return 'uh...';
    }
    else
    {
        switch(args[0])
        {
            case '':
                return '';

            case 'quit':
            case 'exit':
            case 'q':
                model.quit = true;
                return 'goodbye';

            case 'hello':
            case 'hi':
                return 'hello, friend!';

            case 'look':
            case 'l':
                return look(model, args);

            case 'north':
            case 'n':
            case 'east':
            case 'e':
            case 'south':
            case 's':
            case 'west':
            case 'w':
                return go(model, args);

            case 'take':
            case 't':
                return take(model, args);

            case 'drop':
            case 'd':
                return drop(model, args);

            case 'inventory':
            case 'i':
                return inventory(model, args);

            default:
                return 'undefined: ' + args[0];
        }
    }
}
// utility function
function removeIndex(array, index)
{
    if(!(array instanceof Array)) return array;
    if(array.length == 0) return array;
    if(index < 0 || index >= array.length) return array;

    var f = array.slice(0, index);
    var b = array.slice(index + 1, array.length);
    return f.concat(b);
}

// utility function
function notAlreadyIn(array, element)
{
    return array.indexOf(element) < 0;
}

function look(model, args)
{
    var l = model.Player.Location;
    var r = model.Rooms[l];
    var response = 'you are in the ' + l + '\n';

    response += door('North', r);
    response += door('East', r);
    response += door('South', r);
    response += door('West', r);

    response += contents(r);

    return response;
}

function contents(room)
{
    if(room.hasOwnProperty('Contents') && room.Contents.length > 0)
    {
        var count = {};

        room.Contents.forEach(function(item, idx, arr)
        {
            if(count.hasOwnProperty(item.Name))
            {
                count[item.Name] += 1;
            }
            else
            {
                count[item.Name] = 1;
            }
        });

        var response = 'you see:\n';

        for(var name in count)
        {
            if(count.hasOwnProperty(name))
            {
                response += '  ' + count[name] + ' ' + name + '\n';
            }
        }

        return response;
    }
    else
    {
        return '';
    }
}

function door(dir, room)
{
    if(room.hasOwnProperty(dir))
    {
        var d = room[dir];

        if(d.Hidden)
        {
            return '';
        }

        var s = 'to the ' + dir.toLowerCase() + ' is a ';

        if(d.hasOwnProperty('Description'))
        {
            s += d.Description;
        }
        else
        {
            s += 'door'
        }

        if(!d.Closed)
        {
            s += ' to the ' + d.To;
        }

        return s + '\n';
    }
    else
    {
        return '';
    }
}

/*############################# TODO #########################################*/
function go(model, args)
{
    return 'not implemented';
}

function take(model, args)
{
    if(args.length == 1)
    {
        return 'take what?';
    }

    var p = model.Player;
    if(!p.hasOwnProperty('Inventory'))
    {
        p.Inventory = [];
    }

    var r = model.Rooms[p.Location];
    var taken = [];

    OUTER:
    for(var i = 1; i < args.length; i++)
    {
        var name = args[i];

        INNER:
        for(var j = 0; j < r.Contents.length; j++)
        {
            if(notAlreadyIn(taken, r.Contents[j]) && name == r.Contents[j].Name)
            {
                taken.push(r.Contents[j]);
                p.Inventory.push(r.Contents[j]);
                break INNER;
            }
        }
    }

    var counter = {};
    for(var i = 0; i < taken.length; i++)
    {
        var idx = r.Contents.indexOf(taken[i]);

        if(!counter.hasOwnProperty(taken[i].Name))
        {
            counter[taken[i].Name] = 1;
        }
        else
        {
            counter[taken[i].Name] += 1;
        }

        r.Contents = removeIndex(r.Contents, idx);
    }

    var response = 'you took:\n';

    if(taken.length == 0)
    {
        response += '  nothing\n';
    }
    else
    {
        for(var p in counter)
        {
            if(counter.hasOwnProperty(p))
            {
                response += '  ' + counter[p] + ' ' + p + '\n';
            }
        }
    }

    return response;
}

function drop(model, args)
{
    var p = model.Player;
    var r = model.Rooms[p.Location];
    var response = 'you dropped:\n';

    if(!p.hasOwnProperty('Inventory') || p.Inventory.length == 0)
    {
        response += '  nothing\n';
    }
    else
    {
        var dropped = [];

        for(var i = 1; i < args.length; i++)
        {
            var name = args[i];

            for(var j = 0; j < p.Inventory.length; j++)
            {
                if(notAlreadyIn(dropped, p.Inventory[j]) && name == p.Inventory[j].Name)
                {
                    dropped.push(p.Inventory[i]);
                }
            }
        }

        var counter = {};
        for(var i = 0; i < dropped.length; i++)
        {
            var idx = p.Inventory.indexOf(dropped[i]);

            if(!counter.hasOwnProperty(dropped[i].Name))
            {
                counter[dropped[i].Name] = 1;
            }
            else
            {
                counter[dropped[i].Name] += 1;
            }

            p.Inventory = removeIndex(p.Inventory, idx);
        }

        if(dropped.length == 0)
        {
            response += '  nothing\n';
        }
        else
        {
            for(var p in counter)
            {
                if(counter.hasOwnProperty(p))
                {
                    response += '  ' + counter[p] + ' ' + p + '\n';
                }
            }
        }
    }

    return response;
}

function inventory(model, args)
{
    var p = model.Player;
    var response = 'you have:\n';

    if(!p.hasOwnProperty('Inventory') || p.Inventory.length == 0)
    {
        response += '  nothing\n';
    }
    else
    {
        var counter = {};

        for(var i = 0; i < p.Inventory.length; i++)
        {
            var name = p.Inventory[i].Name;

            if(!counter.hasOwnProperty(name))
            {
                counter[name] = 1;
            }
            else
            {
                counter[name] += 1;
            }
        }

        for(var p in counter)
        {
            if(counter.hasOwnProperty(p))
            {
                response += '  ' + counter[p] + ' ' + p + '\n';
            }
        }
    }

    return response;
}
