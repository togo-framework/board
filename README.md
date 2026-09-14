<!-- togo-header -->
<div align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset=".github/assets/togo-mark-dark.svg" /><img src=".github/assets/togo-mark.svg" alt="ToGO" height="64" /></picture>
  <h1>togo-framework/board</h1>
  <p>
    <a href="https://to-go.dev/marketplace"><img src="https://img.shields.io/badge/marketplace-to--go.dev-1F8A99" alt="marketplace" /></a>
    <a href="https://pkg.go.dev/github.com/togo-framework/board"><img src="https://pkg.go.dev/badge/github.com/togo-framework/board.svg" alt="pkg.go.dev" /></a>
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT" />
  </p>
  <p><strong>A <a href="https://to-go.dev">togo</a> plugin — extracted from <a href="https://fadymondy.com">fadymondy.com</a>.</strong></p>
</div>

## Install

```bash
togo install togo-framework/board
```

<!-- /togo-header -->

# board

Drag-and-drop tile board host: arranges widgets, feed posts and page sections across topbar/sidebar/body zones, with per-user layout + save-as-default persistence.



## Frontend

The host UI lives in [`web/`](web): the drag-and-drop **board** + `BoardProvider` (`@togo-framework/board`). It arranges any registered widget/tile across zones with layout persistence. The Go module embeds `web/` via `go:embed` (`WebAssets`).

MIT

<!-- togo-sponsors -->
---

<div align="center">
  <h3>Premium sponsors</h3>
  <p>
    <a href="https://id8media.com"><strong>ID8 Media</strong></a> &nbsp;·&nbsp;
    <a href="https://one-studio.co"><strong>One Studio</strong></a>
  </p>
  <p><sub>Support this work — <a href="https://github.com/sponsors/fadymondy">become a sponsor</a>.</sub></p>
</div>
<!-- /togo-sponsors -->
