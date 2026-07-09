// Package board is the Board togo plugin: Drag-and-drop tile board host: arranges widgets, feed posts and page sections across topbar/sidebar/body zones, with per-user layout + save-as-default persistence.
//
// It self-registers a provider on blank-import and mounts its routes onto the
// kernel. The concrete implementation is ported from the fadymondy.com app under
// internal/server — this scaffold wires the provider + a health route.
package board

import (
	"net/http"

	"github.com/togo-framework/togo"
)

func init() {
	togo.RegisterProviderFunc("board", togo.PriorityService, func(k *togo.Kernel) error {
		k.Router.Get("/api/board/health", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"plugin":"board","status":"ok"}`))
		})
		return nil
	})
}
