(ns ^:figwheel-no-load webbackend.dev
  (:require
    [webbackend.core :as core]
    [devtools.core :as devtools]))


(enable-console-print!)

(devtools/install!)

(core/init!)
