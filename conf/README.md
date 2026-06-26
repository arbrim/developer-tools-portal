# Nginx VM Setup

Use separate nginx files on the VM, matching the existing naming style used by other projects:

```text
/etc/nginx/conf.d/developer-tools-portal-test.conf
/etc/nginx/conf.d/developer-tools-portal-prod.conf
```

Source files in this repository:

```text
conf/nginx-developer-tools-portal.test.conf
conf/nginx-developer-tools-portal.prod.conf
```

## Test

On the VM:

```bash
sudo nano /etc/nginx/conf.d/developer-tools-portal-test.conf
```

Paste the contents of:

```text
conf/nginx-developer-tools-portal.test.conf
```

This routes:

```text
test.developer-tools-portal.com
frontend -> 127.0.0.1:18081
backend  -> 127.0.0.1:19031
```

## Production

On the VM:

```bash
sudo nano /etc/nginx/conf.d/developer-tools-portal-prod.conf
```

Paste the contents of:

```text
conf/nginx-developer-tools-portal.prod.conf
```

This routes:

```text
developer-tools-portal.com
www.developer-tools-portal.com
frontend -> 127.0.0.1:28080
backend  -> 127.0.0.1:29030
```

## Validate And Reload

After creating or editing either file:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

If `sudo nginx -t` fails, do not reload nginx. Fix the reported config issue first.
