"use client";

import { useState } from "react";
import { IconButton } from "./ui";
import { ChevronDown, DownloadIcon, PrintIcon, DoubleArrowRight, ZoomInIcon, ZoomOutIcon } from "./icons";

const MIN_ZOOM = 50;
const MAX_ZOOM = 400;
const ZOOM_STEP = 25;

export default function DocumentViewer() {
  const [zoom, setZoom] = useState(200);

  return (
    <div className="flex flex-col h-full bg-grey-200 min-w-0">
      {/* Toolbar */}
      <div className="bg-grey-100 border-b border-grey-300 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-grey-900 text-sm font-medium whitespace-nowrap">Page 1</span>
          <ChevronDown className="w-4 h-4 text-grey-700 shrink-0" />
        </div>

        <p className="text-grey-900 text-sm font-medium truncate hidden sm:block">
          California...Agreement.pdf
        </p>

        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={<ZoomOutIcon className="w-4 h-4" />}
            label="Zoom out"
            onClick={() => setZoom(Math.max(MIN_ZOOM, zoom - ZOOM_STEP))}
          />
          <span className="text-grey-900 text-xs sm:text-sm font-medium min-w-[40px] text-center">
            {zoom}%
          </span>
          <IconButton
            icon={<ZoomInIcon className="w-4 h-4" />}
            label="Zoom in"
            onClick={() => setZoom(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}
          />
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <IconButton icon={<DownloadIcon className="w-5 h-5" />} label="Download" />
            <IconButton icon={<PrintIcon className="w-5 h-5" />} label="Print" />
            <IconButton icon={<DoubleArrowRight className="w-5 h-5" />} label="Expand" />
          </div>
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="bg-white shadow-lg rounded-sm w-full max-w-[612px] min-h-[792px] p-6 sm:p-8">
          {/* Simulated PDF content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-grey-200 rounded" />
              <div className="text-center">
                <p className="text-xs font-bold text-grey-900 uppercase">
                  California Residential Purchase Agreement
                </p>
                <p className="text-xs text-grey-700">
                  And Joint Escrow Instructions
                </p>
                <p className="text-[10px] text-grey-500">C.A.R. Form RPA, Revised 12/22</p>
              </div>
            </div>

            <div className="border-t border-grey-300 pt-3 flex flex-col gap-2 text-xs text-grey-800">
              <p><span className="font-medium">Date Prepared:</span> November 8, 2023</p>
              <p><span className="font-medium">OFFER:</span></p>
              <p>
                <span className="font-bold">A. THIS IS AN OFFER FROM</span>{" "}
                <span className="bg-green-50/50 px-1">Rachael Laurella, Rob Laurella</span>{" "}
                (&quot;Buyer&quot;)
              </p>
              <p>
                <span className="font-bold">B. THE PROPERTY to be acquired is</span>{" "}
                <span className="bg-green-50/50 px-1">3969 Harbor Boulevard</span>,{" "}
                situated in <span className="bg-green-50/50 px-1">Ventura</span> (City),{" "}
                <span className="bg-green-50/50 px-1">Ventura</span> (County), California,{" "}
                <span className="bg-green-50/50 px-1">93001</span> (&quot;Property&quot;)
              </p>
            </div>

            {/* Simulated form fields */}
            <div className="border border-grey-300 rounded mt-4">
              <div className="bg-grey-50 px-3 py-2 border-b border-grey-300">
                <p className="text-xs font-bold text-grey-900">Paragraphs 1-16 of this Agreement</p>
              </div>
              <div className="p-3 space-y-3">
                {[
                  { label: "A", field: "Purchase Price", value: "$500,000.00" },
                  { label: "B", field: "Close of Escrow (COE)", value: "30 Days after Acceptance" },
                  { label: "C", field: "Expiration of Offer", value: "" },
                  { label: "D", field: "Initial Deposit Amount", value: "" },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2 text-xs">
                    <span className="font-bold text-grey-900 w-4 shrink-0">{row.label}</span>
                    <span className="text-grey-700 flex-1">{row.field}</span>
                    {row.value && (
                      <span className="font-medium text-grey-900 bg-green-50/30 px-1">
                        {row.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* More simulated content lines */}
            <div className="space-y-1.5 mt-3">
              {[82, 75, 91, 88, 95, 79, 86, 93].map((w, i) => (
                <div key={i} className="h-2 bg-grey-200 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
