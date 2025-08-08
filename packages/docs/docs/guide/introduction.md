# Introduction

Welcome to the AavanamKit documentation!

AavanamKit is a complete, open-source ecosystem for creating, designing, and generating data-driven documents in modern web applications.

## The Problem

Building and maintaining document layouts (invoices, receipts, tickets) is a common and frustrating task for developers. Business requirements change, and you're constantly asked to tweak a layout, move a logo, or add a column. This turns you into a report designer instead of a software engineer.

## The AavanamKit Solution

AavanamKit solves this by splitting the problem into two parts:

- **`@aavanamkit/designer`**: A powerful, embeddable React component that provides a full "design studio" for your users. They can visually create and edit their own document templates.

- **`@aavanamkit/engine`**: A pure, headless Node.js library that takes the templates created by the designer, merges them with your live data, and generates pixel-perfect documents (PDF, DOCX) on your server.

This approach empowers your users and frees you to focus on building your application.
