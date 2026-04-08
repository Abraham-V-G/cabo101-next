"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function VehicleSelector({ vehicles, selected, onSelect }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

      {vehicles.map((v: any, index: number) => {
        const active = selected.name === v.name;

        return (
          <motion.div
            key={v.name}
            onClick={() => onSelect(v)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center justify-between p-4 cursor-pointer
              transition-all duration-300
              ${active
                ? "bg-gray-100"
                : "hover:bg-gray-50"}
              ${index !== vehicles.length - 1 ? "border-b border-gray-200" : ""}
            `}
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              <motion.div
                whileHover={{ scale: 1.08 }}
                className="bg-gray-50 rounded-lg p-2"
              >
                <Image
                  src={v.image}
                  alt={v.name}
                  width={90}
                  height={50}
                  className="object-contain"
                />
              </motion.div>

              <div>
                <p className="font-semibold text-gray-900">
                  {v.name}
                </p>

                <p className="text-sm text-gray-500">
                  Up to {v.capacity} passengers
                </p>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">

              <p className="font-semibold text-lg text-gray-900">
                ${v.price}
              </p>

              {active && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-600 font-medium"
                >
                  Selected
                </motion.p>
              )}

            </div>

          </motion.div>
        );
      })}
    </div>
  );
}