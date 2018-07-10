(ns backend.utils)

(defn positions
  [pred coll]
  (keep-indexed (fn [idx x]
                  (when (pred x)
                    idx))
                coll))
