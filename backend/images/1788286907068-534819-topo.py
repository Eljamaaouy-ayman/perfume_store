from mininet.topo import Topo

class myTopo ( Topo ):
    def build( self ):
        rightHost = self.addHost( 'h1' )
        leftHost = self.addHost( 'h2' )
        rightSwitch = self.addSwitch( 's3' )
        leftSwitch = self.addSwitch( 's4' )

        self.addLink(rightHost, rightSwitch)
        self.addLink(rightSwitch, leftSwitch)
        self.addLink(leftHost, leftSwitch)

topos = {'myTopo' : { lambda:myTopo() }}