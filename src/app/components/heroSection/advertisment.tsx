import React from 'react';

const Advertisment = () => {
    const aiModels = ["GPT-4o", "GPT-3", "BERT", "Geminie"];

    return (
        <div className="w-auto h-auto p-4 rounded-md border border-zinc-700">
            <div className="flex flex-row gap-7">
                <div className="w-[450px]">
                    <h1 className="text-[24px] font-bold">Always Get The Best With Single Subscription</h1>
                    <h3 className="text-[16px] font-normal text-neutral-500">No more juggling multiple plans or settling for less. Unlock top-tier AI models effortlessly, ensuring peak performance for contract analysis, content creation, and workflow automation. Stay ahead with automatic updates, seamless integration, and priority access to the latest innovations—all under one simple, powerful plan.</h3>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    {aiModels.map((model, index) => (
                        <div key={index} className="w-[400px] py-2 px-5 rounded border border-neutral-700">{index + 1}. {model}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Advertisment;