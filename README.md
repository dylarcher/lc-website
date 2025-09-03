# Legacy Concierge WordPress Project

**Status**: Critical Issues Identified - Immediate Action Required  
**Last Updated**: September 2, 2025  
**Version**: 2.0

## 🚨 Critical Security Alert

This project has **CRITICAL SECURITY VULNERABILITIES** that require immediate attention. Please review the [SECURITY.md](./docs/SECURITY.md) and [PROJECT-STATUS.md](./docs/PROJECT-STATUS.md) documents immediately.

## Project Overview

Legacy Concierge is a professional WordPress website currently experiencing critical security and performance issues. This repository contains comprehensive documentation for addressing these issues and implementing a modernization strategy.

## 📚 Documentation Structure

All project documentation is located in the `/docs` directory:

| Document | Purpose | Priority |
|----------|---------|----------|
| **[README.md](./docs/README.md)** | Project overview and quick start | 📋 Essential |
| **[BUSINESS-CONTEXT.md](./docs/BUSINESS-CONTEXT.md)** | Company overview and service details | 📋 Essential |
| **[SECURITY.md](./docs/SECURITY.md)** | Security analysis and critical fixes | 🚨 Critical |
| **[PROJECT-STATUS.md](./docs/PROJECT-STATUS.md)** | Current status and action items | 🚨 Critical |
| **[IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)** | Implementation timeline and guide | 📋 High |
| **[MIGRATION-STRATEGY.md](./docs/MIGRATION-STRATEGY.md)** | Third-party replacement strategy | 📋 High |
| **[MAINTENANCE.md](./docs/MAINTENANCE.md)** | Maintenance procedures and history | 📝 Medium |
| **[PLUGINS-AND-TOOLS.md](./docs/PLUGINS-AND-TOOLS.md)** | Plugin recommendations and management | 📝 Medium |

## Quick Start

1. **IMMEDIATE**: Address critical security issues → [SECURITY.md](./docs/SECURITY.md)
2. **Review Status**: Check current project status → [PROJECT-STATUS.md](./docs/PROJECT-STATUS.md)
3. **Implementation**: Follow implementation guide → [IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)
4. **Migration**: Plan long-term strategy → [MIGRATION-STRATEGY.md](./docs/MIGRATION-STRATEGY.md)

## Task Breakdown for GitHub Project Implementation

### **PHASE 1: INITIAL EXTRACTION AND BACKUP**

#### Task 1.1: Complete Site Extraction from A1hosting

**Priority:** High | **Type:** Setup | **Estimated Time:** 2-4 hours

**Description:**
Extract complete WordPress site from A1hosting using cPanel File Manager and phpMyAdmin to create definitive backup before migration.

**Acceptance Criteria:**

* [ ] Complete file archive downloaded (`sitename-backup-YYYY-MM-DD.zip`)
* [ ] Database exported as SQL file (`database-backup-YYYY-MM-DD.sql`)  
* [ ] Site inventory document created with theme, plugins, and configuration details
* [ ] Backup files stored securely with proper naming convention

**Technical Details:**

* Use cPanel File Manager with "Show Hidden Files" enabled
* Include .htaccess and wp-config.php in extraction
* Use phpMyAdmin Custom export with DROP TABLE statements
* Document PHP version, MySQL version, and table prefix

---

#### Task 1.2: Create Site Inventory Documentation  

**Priority:** Medium | **Type:** Documentation | **Estimated Time:** 1-2 hours

**Description:**
Document all critical site components and configurations before migration to ensure nothing is lost during the transition.

**Acceptance Criteria:**

* [ ] Active theme and version documented
* [ ] All plugins listed with activation status
* [ ] Custom post types and taxonomies identified
* [ ] Security keys and salts preserved
* [ ] Database table prefix recorded
* [ ] Widget and menu configurations noted

---

### **PHASE 2: LOCAL DEVELOPMENT SETUP**

#### Task 2.1: Configure Local Development Environment

**Priority:** High | **Type:** Setup | **Estimated Time:** 3-5 hours

**Description:**
Set up Local by Flywheel environment matching A1hosting's specifications and import production data.

**Acceptance Criteria:**

* [ ] Local by Flywheel installed and configured
* [ ] PHP version matches A1hosting environment
* [ ] Production files imported to local environment
* [ ] Database imported and URLs updated
* [ ] Local site functional and accessible
* [ ] wp-config.php updated with local credentials

**Technical Details:**

* Use Local's Adminer for database import
* Implement search-replace for URL updates
* Verify all functionality works locally

---

#### Task 2.2: Establish File Structure for A1hosting Compatibility

**Priority:** High | **Type:** Setup | **Estimated Time:** 2-3 hours

**Description:**
Create project structure that balances modern practices with A1hosting's FTP-only deployment limitations.

**Acceptance Criteria:**

* [ ] Project folder structure created per specifications
* [ ] Custom theme isolated in wp-content/themes/
* [ ] Custom plugins separated from third-party plugins
* [ ] mu-plugins directory created if needed
* [ ] Directory structure documented in README

---

### **PHASE 3: VERSION CONTROL IMPLEMENTATION**

#### Task 3.1: Initialize Git Repository with Comprehensive .gitignore

**Priority:** High | **Type:** Version Control | **Estimated Time:** 2-3 hours

**Description:**
Create clean Git repository using "ignore by default" philosophy to prevent sensitive data inclusion and repository bloat.

**Acceptance Criteria:**

* [ ] .gitignore file created with comprehensive exclusions
* [ ] WordPress core files ignored
* [ ] wp-config.php and sensitive files excluded
* [ ] Third-party plugins/themes ignored
* [ ] Only custom code tracked in repository
* [ ] Initial commit completed with clean structure

**Technical Details:**

* Implement "ignore by default" strategy
* Whitelist only custom theme and plugins
* Exclude uploads, cache, and build files
* Prevent accidental commit of sensitive data

---

#### Task 3.2: Create GitHub Repository and Connect Remote

**Priority:** High | **Type:** Version Control | **Estimated Time:** 1-2 hours

**Description:**
Set up private GitHub repository and establish connection between local and remote repositories.

**Acceptance Criteria:**

* [ ] Private GitHub repository created
* [ ] Local repository connected to GitHub remote
* [ ] Initial code pushed to main branch
* [ ] Branch protection rules configured
* [ ] Repository description and README updated

---

#### Task 3.3: Configure Environment Template System

**Priority:** High | **Type:** Configuration | **Estimated Time:** 2-4 hours

**Description:**
Create environment-aware configuration system for A1hosting's lack of environment variable support.

**Acceptance Criteria:**

* [ ] wp-config-sample.php template created
* [ ] Environment detection by domain implemented
* [ ] .env.example file created for documentation
* [ ] Security keys rotation strategy documented
* [ ] Configuration deployment process defined

**Technical Details:**

* Use HTTP_HOST for environment detection
* Separate production/development configurations
* Generate new security keys for production

---

### **PHASE 4: GITHUB ACTIONS AUTOMATION**

#### Task 4.1: Create Production Deployment Workflow

**Priority:** High | **Type:** CI/CD | **Estimated Time:** 4-6 hours

**Description:**
Implement GitHub Actions workflow for automated FTP deployment to A1hosting with build processes and health checks.

**Acceptance Criteria:**

* [ ] deploy.yml workflow file created
* [ ] FTP deployment action configured
* [ ] Build process for theme assets included
* [ ] Development file cleanup implemented
* [ ] Health check verification added
* [ ] Manual trigger option available

**Technical Details:**

* Use SamKirkland/FTP-Deploy-Action
* Build frontend assets in GitHub Actions
* Clean development files before deployment
* Verify deployment with health check

---

#### Task 4.2: Configure Repository Secrets

**Priority:** High | **Type:** Security | **Estimated Time:** 1-2 hours

**Description:**
Set up encrypted secrets in GitHub repository for secure credential management in CI/CD pipeline.

**Acceptance Criteria:**

* [ ] FTP credentials stored as GitHub secrets
* [ ] Database credentials secured
* [ ] Site URL configured in secrets
* [ ] All sensitive data removed from code
* [ ] Secret rotation schedule established

**Required Secrets:**

* FTP_HOST, FTP_USERNAME, FTP_PASSWORD
* DB_NAME, DB_USER, DB_PASSWORD
* SITE_URL for health checks

---

#### Task 4.3: Create Rollback Workflow

**Priority:** Medium | **Type:** CI/CD | **Estimated Time:** 2-3 hours

**Description:**
Implement emergency rollback workflow for quick recovery from failed deployments.

**Acceptance Criteria:**

* [ ] rollback.yml workflow created
* [ ] Manual trigger with commit SHA input
* [ ] Rollback deployment process tested
* [ ] Documentation for rollback procedure
* [ ] Team training on rollback process

---

#### Task 4.4: Set Up Staging Environment Workflow

**Priority:** Medium | **Type:** CI/CD | **Estimated Time:** 3-4 hours

**Description:**
Create staging deployment workflow using A1hosting subdomain approach.

**Acceptance Criteria:**

* [ ] Staging subdomain created on A1hosting
* [ ] Separate database for staging configured
* [ ] deploy-staging.yml workflow implemented
* [ ] Branch-based deployment strategy defined
* [ ] Staging environment testing process documented

---

### **PHASE 5: DATABASE SYNCHRONIZATION**

#### Task 5.1: Implement Database Sync Strategy

**Priority:** High | **Type:** Data Management | **Estimated Time:** 3-5 hours

**Description:**
Set up robust database synchronization using WP Migrate DB Pro to handle the code vs. state dichotomy.

**Acceptance Criteria:**

* [ ] WP Migrate DB Pro installed and configured
* [ ] Pull from production to local process established
* [ ] URL replacement handling verified
* [ ] Serialized data integrity confirmed
* [ ] Media file synchronization configured
* [ ] One-click sync process documented

**Technical Details:**

* Configure push/pull between environments
* Handle URL search-and-replace automatically
* Sync uploads directory separately
* Create sync schedule for development team

---

#### Task 5.2: Create Database Migration Scripts

**Priority:** Medium | **Type:** Data Management | **Estimated Time:** 2-4 hours

**Description:**
Develop system for tracking and deploying database schema changes in version control.

**Acceptance Criteria:**

* [ ] Migration script template created
* [ ] Version tracking system implemented
* [ ] Schema change deployment process defined
* [ ] Rollback procedures for schema changes
* [ ] Documentation for migration workflow

---

### **PHASE 6: WORKFLOW INTEGRATION AND TESTING**

#### Task 6.1: Complete Development Workflow Testing

**Priority:** High | **Type:** Testing | **Estimated Time:** 4-6 hours

**Description:**
Test entire workflow from local development through staging to production deployment.

**Acceptance Criteria:**

* [ ] End-to-end workflow tested
* [ ] Local to staging deployment verified
* [ ] Staging to production deployment confirmed
* [ ] Rollback procedure tested
* [ ] Database sync tested in both directions
* [ ] Health checks and monitoring validated

**Test Scenarios:**

* Theme changes deployment
* Plugin updates
* Configuration changes
* Emergency rollbacks
* Database synchronization

---

#### Task 6.2: Create Team Documentation and Training Materials

**Priority:** High | **Type:** Documentation | **Estimated Time:** 3-4 hours

**Description:**
Develop comprehensive documentation for team adoption of new workflow.

**Acceptance Criteria:**

* [ ] README.md with complete workflow instructions
* [ ] Development workflow guide created
* [ ] Deployment procedures documented
* [ ] Troubleshooting guide developed
* [ ] Video tutorials recorded (optional)
* [ ] Team training session conducted

---

#### Task 6.3: Implement Monitoring and Alerting

**Priority:** Medium | **Type:** Monitoring | **Estimated Time:** 2-3 hours

**Description:**
Set up monitoring for deployment health, performance, and error tracking.

**Acceptance Criteria:**

* [ ] GitHub Actions notifications configured
* [ ] Deployment status monitoring implemented
* [ ] Error alerting system established
* [ ] Performance monitoring baseline created
* [ ] Log aggregation strategy defined

---

### **PHASE 7: SECURITY AND MAINTENANCE**

#### Task 7.1: Security Hardening and Best Practices

**Priority:** High | **Type:** Security | **Estimated Time:** 2-4 hours

**Description:**
Implement security measures for automated deployment and credential management.

**Acceptance Criteria:**

* [ ] FTPS (FTP over SSL) configured instead of plain FTP
* [ ] FTP credential rotation schedule established
* [ ] File integrity monitoring implemented
* [ ] Access logging and monitoring configured
* [ ] Security audit checklist completed

**Security Checklist:**

* Repository is private
* All secrets properly encrypted
* FTP uses SSL/TLS
* No sensitive data in code
* Regular security scans scheduled

---

#### Task 7.2: Maintenance Procedures and Schedules

**Priority:** Medium | **Type:** Maintenance | **Estimated Time:** 2-3 hours

**Description:**
Establish ongoing maintenance procedures for the automated workflow.

**Acceptance Criteria:**

* [ ] Weekly maintenance checklist created
* [ ] Monthly security review process defined
* [ ] Credential rotation schedule established
* [ ] Backup verification procedures implemented
* [ ] Performance monitoring baseline established
* [ ] Update strategy for workflow dependencies

**Maintenance Schedule:**

* Weekly: Review deployment logs, test staging environment
* Monthly: Rotate passwords, security audit, performance review
* Quarterly: Full workflow testing, documentation updates

---

### **PHASE 8: MIGRATION PATH AND OPTIMIZATION**

#### Task 8.1: Performance Optimization Within A1hosting Constraints

**Priority:** Medium | **Type:** Optimization | **Estimated Time:** 3-5 hours

**Description:**
Optimize site performance while working within A1hosting's shared hosting limitations.

**Acceptance Criteria:**

* [ ] Cloudflare CDN configured for caching
* [ ] Caching plugin installed and optimized
* [ ] Image optimization workflow implemented
* [ ] Plugin usage minimized and optimized
* [ ] Performance baseline measurements taken

**Optimization Strategies:**

* Aggressive caching implementation
* Image optimization in build process
* Minimal plugin footprint
* Static asset optimization

---

#### Task 8.2: Plan Migration Path to Better Hosting

**Priority:** Low | **Type:** Planning | **Estimated Time:** 2-3 hours

**Description:**
Document migration strategy for when A1hosting limitations require upgrade to more capable hosting.

**Acceptance Criteria:**

* [ ] Hosting comparison document created
* [ ] Migration timeline and process defined
* [ ] Cost-benefit analysis completed
* [ ] Technical requirements documented
* [ ] Migration checklist developed

**Recommended Alternatives:**

* SiteGround (SSH, Git integration)
* Cloudways (managed cloud with deployment tools)
* WP Engine (enterprise WordPress hosting)
* DigitalOcean + RunCloud (full control)

---

## **IMPLEMENTATION TIMELINE**

**Week 1-2: Foundation (Tasks 1.1-2.2)**

* Site extraction and backup
* Local development setup
* File structure establishment

**Week 3-4: Version Control (Tasks 3.1-3.3)**

* Git repository initialization  
* GitHub setup and configuration
* Environment template system

**Week 5-6: Automation (Tasks 4.1-4.4)**

* GitHub Actions workflows
* Security configuration
* Staging environment setup

**Week 7-8: Data Management (Tasks 5.1-5.2)**

* Database synchronization
* Migration script system

**Week 9-10: Integration (Tasks 6.1-6.3)**

* End-to-end testing
* Documentation and training
* Monitoring implementation

**Week 11-12: Security & Maintenance (Tasks 7.1-8.2)**

* Security hardening
* Maintenance procedures
* Future planning

This comprehensive breakdown provides 22 distinct tasks organized into 8 phases, with clear acceptance criteria, technical details, and implementation timeline. Each task includes priority levels, estimated time, and specific deliverables needed to successfully transition from manual A1hosting management to a professional GitHub-based automated workflow.
