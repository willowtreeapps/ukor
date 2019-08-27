sub main(args as object)
    appInfo = CreateObject("roAppInfo")
    m.port = CreateObject("roMessagePort")

    screen = CreateObject("roSGScreen")
    screen.setMessagePort(m.port)

    scene = screen.CreateScene("AppScene")
    screen.show()

    if appInfo.isDev() and args.runTests = "true" then
        runUnitTests()
    else
        runMainLoop()
    end if
end sub

sub runUnitTests()
    ' put your code here
end sub

sub runMainLoop()
    while true
        msg = wait(0, m.port)

        if type(msg) = "roSGScreenEvent"
            if msg.isScreenClosed() then return
        end if
    end while
end sub
