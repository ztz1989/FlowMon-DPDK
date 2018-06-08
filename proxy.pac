/*
** automatic proxy configuration V2.1 for 135.238.224.20 from 135.239.8.82 (135.239.8.82)
*/
function FindProxyForURL(url, host) {
 var proxy="PROXY 135.245.192.7:8000;";
 if ( shExpMatch(host, "localhost") ) { return "DIRECT"; }
 if ( shExpMatch(host, "localhost.*") ) { return "DIRECT"; }
 if ( shExpMatch(host, "127.0.0.*") ) { return "DIRECT"; }
 if ( isPlainHostName(host) ) { return "DIRECT"; }
 if ( isInNet(myIpAddress(), "10.255.32.0", "255.255.240.0")) { return "DIRECT"; }

 if (host == "r3.res.outlook.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "192.194.198.4") {  return "PROXY fihelprx-defraprx.glb.nsn-net.net:8080"; }
 if (host == "performancemanager5.successfactors.eu") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "cmp.nsn.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "fidm.access.it-solutions.atos.net") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "eu1.concursolutions.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (shExpMatch(host,"*myrealestate.ext.nokia.com") ) {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "r1.res.office365.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "r3.res.office365.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "r4.res.office365.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "nsnsiacc.service-now.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "nsnsi.service-now.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if ( dnsDomainIs(host, ".partner.nokia.com") ) {  return "PROXY 10.49.0.28:8080"; }
 if ( dnsDomainIs(host, ".nnok.nokia.com") ) {  return "PROXY 10.49.0.28:8080"; }
 if (host == "nokia.kronos.net") {  return "PROXY 10.158.100.3:8080"; }
 if (host == "ieeexplore.ieee.org") {  return "PROXY 10.158.100.3:8080"; }
 if (host == "treasury.int.nokia.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "www.moi.gov.sa") {  return "PROXY 10.158.100.2:8080"; }
 if (host == "workspace.vodafone.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "meet.vodafone.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "webskype-rat.vodafone.com") {  return "PROXY defraprx-fihelprx.glb.nsn-net.net:8080"; }
 if (host == "generator.cppc.gov.pl") {  return "DIRECT"; }
 if (host == "wow.corp.vodafone.pt") {  return "DIRECT"; }
 if (host == "lab-ssl.upcbroadband.com") {  return "DIRECT"; }
 if (host == "pass.bt.es") {  return proxy; }
 if (host == "autodiscover.nokia.com") {  return "DIRECT"; }
 if (host == "autodiscover.bell-labs-consulting.com") {  return "DIRECT"; }
 if (host == "nokia-ers.accenture.com") {  return "DIRECT"; }
 if (host == "owncloud.cloud-band.com") {  return "DIRECT"; }
 if (host == "citrix-secure.virginmedia.co.uk") {  return "DIRECT"; }
 if (host == "autodiscover.on.bell-labs-consulting.com") {  return "DIRECT"; }
 if (host == "home.office.com") {  return "DIRECT"; }
 if (host == "citrix-secure-test.virginmedia.co.uk") {  return "DIRECT"; }
 if (host == "autodiscover.msg.nokia.com") {  return "DIRECT"; }
 if (host == "oss-portal.eplus.de") {  return "DIRECT"; }
 if (host == "autodiscover.on.nokia-bell-labs.com") {  return "DIRECT"; }
 if (host == "rapidresponse3.kinaxis.com") {  return "DIRECT"; }
 if (host == "gutvpn01.telefonica.de") {  return "DIRECT"; }
 if (host == "autodiscover.nokia-bell-labs.com") {  return "DIRECT"; }
 if (host == "mweb2005.ciin.att.com") {  return "DIRECT"; }
 if (host == "efms.cif.att.com") {  return "DIRECT"; }
 if (host == "ntworkplace.lb.de.pri.o2.com") {  return "DIRECT"; }
 if (host == "ntportal.lb.de.pri.o2.com") {  return "DIRECT"; }
 if (host == "geostweb.geolink.att.com") {  return "DIRECT"; }
 if (host == "cag-2-s.eplus.de") {  return "DIRECT"; }
 if (host == "self.sso-dev.infra.ftgroup") {  return "DIRECT"; }
 if (host == "rapidresponse2.kinaxis.com") {  return "DIRECT"; }
 if (host == "mucvpn01.telefonica.de") {  return "DIRECT"; }
 if (host == "portal.office.com") {  return "DIRECT"; }
 if (host == "rapidresponse.kinaxis.com") {  return "DIRECT"; }
 if (host == "noria.sso.francetelecom.fr") {  return "DIRECT"; }
 if (host == "enterprise.sungard.com") {  return "DIRECT"; }
 if (host == "autodiscover.on.nokia.com") {  return "DIRECT"; }
 if (host == "cag-1-s.eplus.de") {  return "DIRECT"; }
 if (host == "ssl01.upcbroadband.com") {  return "DIRECT"; }
 if (host == "ssl02.upcbroadband.com") {  return "DIRECT"; }
 if (host == "help.kinaxis.com") {  return "DIRECT"; }
 if (host == "159.217.144.75/demo/demo.html") {  return "DIRECT"; }
 if (host == "assist.verizon.com") {  return "DIRECT"; }
 if (host == "app.nokia.com") {  return "DIRECT"; }
 if (host == "intra.tc.ewz.ch") {  return "DIRECT"; }
 if (host == "eu1stg-p.serviceportal.hp.com") {  return "DIRECT"; }
 if (host == "ssologin.verizon.com") {  return "DIRECT"; }
 if (host == "serasaexperianportais.com.br") {  return "DIRECT"; }
 if (host == "imweb.verizon.com") {  return "DIRECT"; }
 if (host == "ahjndcspa02.vzbi.com") {  return "DIRECT"; }
 if (host == "home12.bouyguestelecom.fr") {  return "DIRECT"; }
 if (host == "ccp.verizon.com") {  return "DIRECT"; }
 if (host == "ahjomzspa02.vzbi.com") {  return "DIRECT"; }
 if (host == "eu1-p.serviceportal.hp.com") {  return "DIRECT"; }
 if (host == "csp.hcac.com") {  return "DIRECT"; }
 if (host == "paxs3.bouyguestelecom.fr") {  return "DIRECT"; }
 if (host == "home11.bouyguestelecom.fr") {  return "DIRECT"; }
 if (host == "aditumalu.kpn.com") {  return "DIRECT"; }
 if (host == "your.kpn.com") {  return "DIRECT"; }
 if (host == "videonpe.it.att.com") {  return "DIRECT"; }
 if (host == "venue-ss2.verizon.com") {  return "DIRECT"; }
 if (host == "eu1stg.serviceportal.hp.com") {  return "DIRECT"; }
 if (host == "eissac.verizon.com") {  return "DIRECT"; }
 if (host == "nok.it") {  return "DIRECT"; }
 if (host == "ssologindr.verizon.com") {  return "DIRECT"; }
 if (host == "prod.broadjump.com") {  return "DIRECT"; }
 if (host == "naperville.hcac.com") {  return "DIRECT"; }
 if (host == "logintpa.verizon.com") {  return "DIRECT"; }
 if (host == "alu.tl") {  return "DIRECT"; }
 if (host == "loginsac.verizon.com") {  return "DIRECT"; }
 if (host == "192.11.69.188") {  return "DIRECT"; }
 if (host == "paxs1.bouyguestelecom.fr") {  return "DIRECT"; }
 if (host == "eisbh.verizon.com") {  return "DIRECT"; }
 if (host == "vfnl-citrix.vodafone.com") {  return "DIRECT"; }
 if (host == "loginfdc.verizon.com") {  return "DIRECT"; }
 if (host == "eng.timetra.com") {  return "DIRECT"; }
 if (host == "vpnportal-internal.kpn.com") {  return "DIRECT"; }
 if (host == "omc.hp.com") {  return "DIRECT"; }
 if (host == "helpdesk.verizon.com") {  return "DIRECT"; }
 if (host == "vf-pt.internal.vodafone.com") {  return "DIRECT"; }
 if (host == "ipvoiceconnect.sprint.com") {  return "DIRECT"; }
 if (host == "eu2-p.serviceportal.hp.com") {  return "DIRECT"; }
 if (host == "atom.it.att.com") {  return "DIRECT"; }
 if (host == "ag.optus.com.au") {  return "DIRECT"; }
 if (host == "eweb.verizon.com") {  return "DIRECT"; }
 if (host == "cockpit.app.nokia.com") {  return "DIRECT"; }
 if (host == "cockpit-qa.app.nokia.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".noklab.net") ) {  return "DIRECT"; }
 if (host == "139.16.217.19") {  return "DIRECT"; }
 if (host == "mercer-prod.inside.nsn.com") {  return "PROXY 87.254.212.120:8080"; }
 if (host == "mercer-test.inside.nsn.com") {  return "PROXY 87.254.212.120:8080"; }
 if ( dnsDomainIs(host, ".int.net.nokia.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".int.nokia.com") ) {  return "DIRECT"; }
 if (shExpMatch(host,"nra-*.net.nokia.com") ) {  return "DIRECT"; }
 if (host == "virtual-services.ext.nokia.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".alcatel-sbell.com.cn") ) {  return "DIRECT"; }
 if (shExpMatch(host,"*crm4.dynamics.com") ) {  return "DIRECT"; }
 if (shExpMatch(host,"orava-*.ext.net.nokia.com") ) {  return "DIRECT"; }
 if (host == "outlook.office.com") {  return "DIRECT"; }
 if (host == "eu-p.serviceportal.hp.com") {  return "DIRECT"; }
 if (shExpMatch(host,"*app.nokia.com") ) {  return "DIRECT"; }
 if (host == "officeapps.live.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".streaming.mediaservices.windows.net") ) {  return proxy; }
 if ( dnsDomainIs(host, ".keydelivery.mediaservices.windows.net") ) {  return proxy; }
 if ( dnsDomainIs(host, ".windows.net") ) {  return "DIRECT"; }
 if (host == "activedirectory.windowsazure.com") {  return "DIRECT"; }
 if (host == "onenote.com") {  return "DIRECT"; }
 if (host == "assets-yammer.com") {  return "DIRECT"; }
 if (host == "yammer.com") {  return "DIRECT"; }
 if (host == "yammerusercontent.com") {  return "DIRECT"; }
 if (host == "activation.sls.microsoft.com") {  return "DIRECT"; }
 if (host == "outlook.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".nsn-net.net") ) {  return "DIRECT"; }
 if (host == "nsn-net.net") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".inside.nokiasiemensnetworks.com") ) {  return "DIRECT"; }
 if (host == "inside.nokiasiemensnetworks.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".psepartner.net") ) {  return "DIRECT"; }
 if (host == "psepartner.net") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".access.nokiasiemensnetworks.com") ) {  return "DIRECT"; }
 if (host == "access.nokiasiemensnetworks.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".nsn-intra.net") ) {  return "DIRECT"; }
 if (host == "nsn-intra.net") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".nsn-rdnet.net") ) {  return "DIRECT"; }
 if (host == "nsn-rdnet.net") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".inside.nsn.com") ) {  return "DIRECT"; }
 if (host == "inside.nsn.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".access.nsn.com") ) {  return "DIRECT"; }
 if (host == "access.nsn.com") {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".local") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".nbnco.net.au") ) {  return "PROXY 10.158.100.96:8080"; }
 if ( dnsDomainIs(host, ".einea.fr") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".geopepper.com") ) {  return proxy; }
 if ( dnsDomainIs(host, ".mediaservices.windows.net") ) {  return proxy; }
 if ( dnsDomainIs(host, ".activedirectory.windowsazure.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".outlook.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".life.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".atlprom.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".sharepoint.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".infra.ftgroup") ) { dnsResolve(host+'.bf.nsn-intra.net'); return "DIRECT"; }
 if ( dnsDomainIs(host, ".lync.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".officeapps.live.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".sales.ftgroup") ) { dnsResolve(host+'.bf.nsn-intra.net'); return "DIRECT"; }
 if ( dnsDomainIs(host, ".microsoftonline.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".neoweb.neo.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".sbamc.com.cn") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".onmicrosoft.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".francetelecom.fr") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".res.office365.com") ) {  return proxy; }
 if ( dnsDomainIs(host, ".office365.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".assets-yammer.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".kcdc.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".yammerusercontent.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".onenote.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".hclt.corp.hcl.in") ) { dnsResolve(host+'.bf.nsn-intra.net'); return "DIRECT"; }
 if ( dnsDomainIs(host, ".jazz.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".yammer.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".netops.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".ctx.it.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".aldc.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".intranet.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".cso.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".webphone.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".it.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".ims.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".vci.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".lno.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".web.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".homer.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".cif.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".geolink.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".q.att.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".toolsssl.sbc.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".ce.sbc.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".desktop.sbc.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".ecorp.sbc.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".englogin.sbc.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".alnclncapp01.wnsnet.attws.com") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".sso.francetelecom.fr") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".miisolutions.net") ) { dnsResolve(host+'.bf.nsn-intra.net'); return "DIRECT"; }
 if (shExpMatch(host,"hackerearth*.global.ssl.fastly.net") ) {  return proxy; }
 if ( dnsDomainIs(host, ".fastly.net") ) {  return "DIRECT"; }
 if ( dnsDomainIs(host, ".eng.velocix.com") ) {  return "PROXY 135.117.27.15:3128"; }
 if ( dnsDomainIs(host, ".corp.velocix.com") ) {  return "PROXY 135.117.27.15:3128"; }
 if ( dnsDomainIs(host, ".int.nokia-sbell.com") ) {  return "DIRECT"; }
 if (host == "nokiameetings.webex.com") {  return "DIRECT"; }




 if (isResolvable(host)) {
 resolved_host = dnsResolve(host);
 if ( isInNet(resolved_host, "202.50.231.70","255.255.255.255") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "139.156.76.17","255.255.255.255") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "139.156.76.1","255.255.255.255") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.200.112.55","255.255.255.255") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "132.201.30.65","255.255.255.255") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.199.16","255.255.255.255") ) { return "PROXY 87.254.212.120:8080"; }
 if ( isInNet(resolved_host, "10.116.228.168","255.255.255.248") ) { return "PROXY 87.254.212.120:8080"; }
 if ( isInNet(resolved_host, "65.55.121.128","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "207.46.7.128","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.46.0","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.229.128","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.104.96","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.72.96","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.25.32","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.225.192","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "111.221.17.128","255.255.255.224") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "212.240.203.0","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.46.64","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.57.192","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.28.192","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.225.128","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.170.192","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "111.221.22.64","255.255.255.192") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "131.228.0.0","255.255.128.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "65.54.54.128","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "207.46.57.0","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.73.33.0","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.40.128","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.55.238.0","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "143.116.149.0","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "111.221.23.0","255.255.255.128") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "65.55.127.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "208.8.1.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "207.46.5.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "199.89.161.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "199.89.143.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.73.42.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.206.182.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.206.181.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.205.61.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.17.148.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.151.197.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.75.232.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.74.230.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.234.243.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.105.195.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "15.143.139.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "15.143.137.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.51.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.30.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.251.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.151.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.12.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.237.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.35.44.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "202.65.8.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.206.186.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "194.62.120.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "194.34.60.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.107.176.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "198.205.56.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.74.204.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.107.172.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.103.16.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "202.65.0.0","255.255.248.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "202.39.112.0","255.255.240.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "193.131.16.0","255.255.240.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.252.16.0","255.255.240.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "159.217.128.0","255.255.224.0") ) { return proxy; }
 if ( isInNet(resolved_host, "87.254.192.0","255.255.224.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "10.125.64.0","255.255.224.0") ) { return "PROXY 87.254.212.120:8080"; }
 if ( isInNet(resolved_host, "93.183.0.0","255.255.192.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.128.0","255.255.192.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.0.0","255.255.128.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "199.118.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.168.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "192.11.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "159.23.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "157.56.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "155.4.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "155.132.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "152.148.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "151.98.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "149.204.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "146.112.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "143.209.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "139.54.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "139.188.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.203.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "138.120.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.88.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.183.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.18.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.171.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.17.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.140.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.112.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.111.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.108.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.107.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.104.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.103.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.1.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "132.245.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "130.198.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "130.131.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "128.251.0.0","255.255.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "159.216.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.180.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.184.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.92.0.0","255.255.240.0") ) { return proxy; }
 if ( isInNet(resolved_host, "135.38.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.22.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.2.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.124.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.120.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.114.0.0","255.254.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.84.0.0","255.252.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.4.0.0","255.252.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.220.0.0","255.252.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.12.0.0","255.252.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.116.0.0","255.252.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "172.16.0.0","255.240.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.224.0.0","255.224.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "127.0.0.0","255.0.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "10.0.0.0","255.0.0.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.121.116.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.228.4.0","255.255.252.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.0.0","255.255.254.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.17.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.32.0","255.255.255.0") ) { return "DIRECT"; }
 if ( isInNet(resolved_host, "135.109.135.0","255.255.255.0") ) { return "DIRECT"; }
}
 return proxy;
}
