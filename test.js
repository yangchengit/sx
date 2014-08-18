var test = require('tape').test;
var exec = require('child_process').exec;
var fs = require('fs');

var testOut = function(t, success){
    return function(err, stdout, stderr){
        t.notOk(err);
        t.notOk(stderr);
        success(stdout.substr(0, stdout.length - 1));
    };
};

test("Should run all tests", function(t){ 
    t.test("sx --completion", function(t){
        t.plan(3);
        exec('./bin/sx --completion', testOut(t, function(stdout){
            t.same(fs.readFileSync('./lib/completion.sh', 'utf-8'), stdout);
        }));
    });

    t.test("sx --pretty", function(t){
        t.plan(3);
        exec('./bin/sx -p "({a:1})"', testOut(t, function(stdout){
            t.same("{\n    \"a\": 1\n}", stdout);
        }));
    });

    t.test("sx --json", function(t){
        t.plan(3);
        exec('./bin/sx "({a:\'b\'})" | ./bin/sx -ji i.a', testOut(t, function(stdout){
            t.same("b", stdout);
        }));
    });

    t.test("sx --input", function(t){
        t.plan(3);
        exec('./bin/sx 3 | ./bin/sx -i +i+5', testOut(t, function(stdout){
            t.same("8", stdout);
        }));
    });

    t.test("sx --list", function(t){
        t.plan(3);
        exec('for n in 1 2 3; do echo $n; done | ./bin/sx -l "l[1]"', testOut(t, function(stdout){
            t.same("2", stdout);
        }));
    });

    t.test("sx --reduce", function(t){
        t.plan(3);
        exec('for n in 1 2 3; do echo $n; done | ./bin/sx -lir 0 +i+r', testOut(t, function(stdout){
            t.same("6", stdout);
        }));
    });

    t.test("sx --async", function(t){
        t.plan(3);
        exec('./bin/sx -a "setTimeout(a.bind(0, 1), 100)"', testOut(t, function(stdout){
            t.same("1", stdout);
        }));
    });

    t.test("sx --filter", function(t){
        t.plan(3);
        exec('./bin/sx 1 | ./bin/sx -fi i==1', testOut(t, function(stdout){
            t.same("1", stdout);
        }));
    });

    t.test("sx --string", function(t){
        t.plan(3);
        exec('./bin/sx -s "Function()"', testOut(t, function(stdout){
            t.same("// vim: filetype=javascript\nfunction anonymous() {\n\n}", stdout);
        }));
    });
});

