sub main(params as object)
  ' set up your screen

  'check for test parameter
  if params.RunTests = "true"
    runner = TestRunner()
    if params.host <> invalid
      runner.logger.SetServer(params.host, params.port, params.protocol)
    else
      runner.logger.SetServerURL(param.url)
    end if
    ' other setup if needed

    runner.run()
  end if

  ' start event loop

end sub