# Docker Setup Guide

This guide helps you set up the PostgreSQL database using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2+

## Quick Start

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Check if the database is running:**
   ```bash
   docker-compose ps
   ```

   You should see:
   ```
   NAME                 IMAGE               STATUS
   imagefx-postgres     postgres:16-alpine  Up (healthy)
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f postgres
   ```

4. **Access the database:**
   ```bash
   docker-compose exec postgres psql -U imagefx -d imagefx_db
   ```

## Common Commands

### Stop the database
```bash
docker-compose stop
```

### Restart the database
```bash
docker-compose restart
```

### Stop and remove containers (data persists in volume)
```bash
docker-compose down
```

### Stop and remove everything including data
```bash
docker-compose down -v
```

### View database tables
```bash
docker-compose exec postgres psql -U imagefx -d imagefx_db -c "\dt"
```

### Run SQL commands
```bash
docker-compose exec postgres psql -U imagefx -d imagefx_db -c "SELECT * FROM users;"
```

## Database Connection

When the database is running, you can connect using these credentials:

- **Host:** localhost
- **Port:** 5432
- **Database:** imagefx_db
- **User:** imagefx
- **Password:** imagefx_password

## Backup and Restore

### Create a backup
```bash
docker-compose exec postgres pg_dump -U imagefx imagefx_db > backup.sql
```

### Restore from backup
```bash
docker-compose exec -T postgres psql -U imagefx imagefx_db < backup.sql
```

### Create compressed backup
```bash
docker-compose exec postgres pg_dump -U imagefx imagefx_db | gzip > backup.sql.gz
```

### Restore from compressed backup
```bash
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U imagefx imagefx_db
```

## Troubleshooting

### Port already in use
If port 5432 is already in use, you can change it in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use host port 5433 instead
```

Then update your `.env` file:
```
DB_PORT=5433
```

### Database not starting
Check logs for errors:
```bash
docker-compose logs postgres
```

### Reset database
To start fresh with a clean database:
```bash
docker-compose down -v
docker-compose up -d
```

### Connection refused
Make sure the container is running and healthy:
```bash
docker-compose ps
docker-compose exec postgres pg_isready -U imagefx
```

## Advanced Configuration

### Custom PostgreSQL Configuration

Create a `postgres.conf` file and mount it:
```yaml
volumes:
  - ./postgres.conf:/etc/postgresql/postgresql.conf
```

### Environment Variables

You can customize the database by modifying environment variables in `docker-compose.yml`:
```yaml
environment:
  POSTGRES_USER: myuser
  POSTGRES_PASSWORD: mypassword
  POSTGRES_DB: mydb
```

### Performance Tuning

For production use, consider adjusting these PostgreSQL settings:
```yaml
command:
  - "postgres"
  - "-c"
  - "max_connections=200"
  - "-c"
  - "shared_buffers=256MB"
```

## Production Considerations

For production deployments:

1. **Use strong passwords** - Change default credentials
2. **Enable SSL/TLS** - Configure encrypted connections
3. **Set up backups** - Automate regular backups
4. **Monitor performance** - Use pg_stat_statements
5. **Configure logging** - Enable query logging for debugging
6. **Limit connections** - Set appropriate max_connections
7. **Use managed services** - Consider AWS RDS, Google Cloud SQL, etc.

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
