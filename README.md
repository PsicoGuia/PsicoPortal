# Install

1. first intall ionic see https://ionicframework.com/docs/v1/guide/installation.html
2. npm i
3. ionic build --prod
4. copy <proyect-path>/www to /var/www/html
5. configure proxy apache

# Run

1. npm i
2. ionic serve

# Config apache
```xml
<VirtualHost *:443>
	ServerAdmin webmaster@localhost
    #copy www in /var/www/html
	DocumentRoot /var/www/html

	#LogLevel info ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
	
	# By LKS
	ServerName www.psicoguia.com
    ServerAlias www.psicoguia.com


	# Proxy for api of django on port 8000
	ProxyPassMatch ^/api/(.*) http://localhost:8000/api/$1
    ProxyPassReverse ^/api/(.*) http://localhost:8000/api/$1

    # if ServerName psicoguia.com
	# Redirect permanent / https://www.psicoguia.com/

    #CERT SSL	

	SSLCertificateFile /etc/letsencrypt/live/psicoguia.com/cert.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/psicoguia.com/privkey.pem
	Include /etc/letsencrypt/options-ssl-apache.conf
	SSLCertificateChainFile /etc/letsencrypt/live/psicoguia.com/chain.pem
</VirtualHost>
```
# TODO
Estudio + Instituto