package board

import "embed"

// WebAssets is the plugin's frontend (the widget's React UI). A togo app bundles
// it from the module; see web/ for the component source.
//
//go:embed web
var WebAssets embed.FS
