const request = require("request");
const log = require("../utils/log");
const installer = require("./install");
const http = require("http");
const fs = require("fs");
const getIP = require("ip");
const XMLWriter = require("xml-writer");
const mkdirp = require("mkdirp");

function runLogServer(ip, port, timeout, callback) {
  let logServer = http.createServer((req, res) => {
    let body = [];
    req.on("data", data => {
      body.push(data);
    });
    req.on("end", () => {
      try {
        body = Buffer.concat(body).toString();
        let stats = JSON.parse(body);
        log.pretty("info", "", stats);
        writeJunit(stats);
        if (stats) {
          log.info("------------");
          log.info("Test Results");
          log.info(
            "Pass: %d | Fail: %d | Crash: %d",
            stats.correct,
            stats.fail,
            stats.crash
          );
          log.info("===================================");
          stats.suites.forEach(suite => {
            log.info("%s: %d tests", suite.name, suite.tests.length);
            suite.tests.forEach(test => {
              log.info("\t%s: %s", test.name, test.result);
              if (test.result != "Success") {
                log.info(
                  "\t\tError %d: %s",
                  test.error.code,
                  test.error.message
                );
              }
            });
            log.info("---------------------------------");
          });
          log.info(
            "Pass: %d | Fail: %d | Crash: %d",
            stats.correct,
            stats.fail,
            stats.crash
          );
          if (stats.fail > 0) {
            process.exit(-1);
          }
        }
        callback ? callback(stats) : null;
        res.statusCode = "200";
      } catch (e) {
        log.error(e.message);
        res.statusCode = "403";
      }
      res.end("ok", () => {
        logServer.close();
      });
    });
  });
  logServer.listen(parseInt(port), getIP.address(), () => {
    log.info("listening for tests on %s:%s", getIP.address(), port);
  });
  return logServer;
}

function writeJunit(stats) {
  const xml = new XMLWriter();
  xml.startDocument();
  xml
    .startElement("testsuites")
    .writeAttribute("name", "rokuTests")
    .writeAttribute("tests", "" + stats.total)
    .writeAttribute("failures", "" + stats.fail);
  stats.suites.forEach(suite => {
    xml
      .startElement("testsuite")
      .writeAttribute("name", suite.name)
      .writeAttribute("tests", "" + suite.total)
      .writeAttribute("failures", suite.fail);
    suite.tests.forEach(test => {
      xml
        .startElement("testcase")
        .writeAttribute("name", test.name)
        .writeAttribute("time", "" + test.time * 0.001);
      if (test.result != "Success") {
        xml
          .startElement("failure")
          .writeAttribute("type", "" + test.error.code)
          .text(test.error.message)
          .endElement();
      }
      xml.endElement();
    });
    xml.endElement();
  });
  xml.endElement();
  xml.endDocument();
  mkdirp("./out/tests");
  fs.writeFileSync("./out/tests/ukorTests.junit", xml.toString());
  fs.writeFileSync("./out/tests/ukorTests.xml", xml.toString());
}

function runTests(ip, auth, port, callback) {
  setTimeout(() => {
    let url =
      "http://" +
      ip +
      ":8060/launch/dev?RunTests=true&host=" +
      getIP.address() +
      "&port=" +
      port;
    log.verbose("starting tests with: %s", url);
    request.post(
      url,
      {
        auth: auth
      },
      (err, response, body) => {
        if (response.statusCode != 200) {
          log.error("Error starting tests: %d", response.statusCode);
          process.exit(-1);
        } else {
          log.info("Tests started");
        }
        callback ? callback(response.statusCode == 200) : null;
      }
    );
  }, 3000);
}

module.exports = {
  test: (options, callback) => {
    installer.installTest(options, (ip, success) => {
      log.info("finished install, running tests");
      if (!success) return;
      let port = options.port || "8086";
      let server = runLogServer(ip, port, 5 * 60 * 1000, results => {
        if (results) {
          process.exit(0);
        } else {
          process.exit(-1);
        }
      });
      runTests(ip, options.auth, options.port, success => {
        if (!success) {
          logServer.close();
          process.exit(-1);
        }
      });
    });
  }
};
