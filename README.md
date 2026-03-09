# Spend Tracker DevOps Project

A personal spend tracker application built with React and Vite, containerized with Docker, provisioned in Azure using Terraform, and automated with GitHub Actions.

## Overview

This project was built to practice modern DevOps workflows using a real frontend application.

It includes:

- a React + Vite frontend
- Docker containerization
- Azure Container Registry integration
- Terraform infrastructure provisioning
- GitHub Actions CI/CD pipelines
- Azure Static Web App deployment

## Features

- Track weekly income
- Track expenses
- Track savings separately
- Simple and clean user interface
- Fast frontend with React and Vite

## Tech Stack

- React
- Vite
- TypeScript
- Docker
- Terraform
- Microsoft Azure
- GitHub Actions

## Infrastructure

Terraform provisions the following Azure resources:

- Azure Resource Group
- Azure Container Registry

## CI/CD Pipelines

This project includes two GitHub Actions workflows:

### 1. Static Web App Deployment
Builds and deploys the React frontend to Azure Static Web Apps.

### 2. Docker Build and Push
Builds a Docker image and pushes it to Azure Container Registry.

### 2. note for self

Frontend live website:
Azure Static Web Apps

DevOps/container practice:
Docker → GitHub Actions → ACR

find .github -type f
.github/workflows/azure-static-web-apps-happy-mud-012a93300.yml
.github/workflows/docker-acr.yml

## Project Structure

```bash
spend-tracker/
├── src/
├── public/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── .terraform.lock.hcl
├── .github/
│   └── workflows/
├── Dockerfile
├── .dockerignore
├── README.md
└── package.json


