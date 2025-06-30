"use client";
import React, { useState } from "react";
import Image from "next/image";
import { conversations, users } from "./mock-data";
import { Phone, Mail, PlusCircle } from "lucide-react";

interface CustomerContextProps {
  activeConversation: number | null;
}

const CustomerContext = ({ activeConversation }: CustomerContextProps) => {
  const [activeTab, setActiveTab] = useState<"customer" | "orders">("customer");

  // Find the active conversation
  const conversation = conversations.find((c) => c.id === activeConversation);

  // Get the customer
  const customer = conversation?.participants.find(
    (p) => p.role !== "admin"
  );

  if (!conversation || !customer) {
    return (
      <div className="h-full flex items-center justify-center text-text3 p-4">
        <div className="text-center">
          <p>Select a conversation to view customer details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray">
        <h3 className="text-lg font-medium">Customer Info</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === "customer"
              ? "border-b-2 border-theme text-theme"
              : "text-text3 hover:text-theme"
          }`}
          onClick={() => setActiveTab("customer")}
        >
          Profile
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
            activeTab === "orders"
              ? "border-b-2 border-theme text-theme"
              : "text-text3 hover:text-theme"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "customer" ? (
          // Customer profile
          <div>
            {/* Customer avatar and basic info */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    customer.status === "online"
                      ? "bg-success"
                      : customer.status === "away"
                      ? "bg-warning"
                      : "bg-gray"
                  }`}
                ></span>
              </div>
              <h4 className="text-lg font-medium">{customer.name}</h4>
              <p className="text-sm text-text3">{customer.email}</p>
              <div className="mt-2 flex gap-2">
                <button className="p-2 bg-gray5 text-black rounded-full hover:bg-gray6 hover:shadow-glow-xs transition-all">
                  <Phone size={16} />
                </button>
                <button className="p-2 bg-gray5 text-black rounded-full hover:bg-gray6 hover:shadow-glow-xs transition-all">
                  <Mail size={16} />
                </button>
                <button className="p-2 bg-gray5 text-black rounded-full hover:bg-gray6 hover:shadow-glow-xs transition-all">
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>

            {/* Customer details */}
            <div className="space-y-4">
              {customer.role === "customer" && (
                <>
                  <div className="p-4 bg-gray5 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-text3 text-sm">Customer since</span>
                      <span className="text-sm font-medium">
                        {customer.joinedDate}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text3 text-sm">Orders</span>
                      <span className="text-sm font-medium">
                        {customer.orders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text3 text-sm">Total spent</span>
                      <span className="text-sm font-medium">
                        ${customer.totalSpent?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-tiny px-2 py-1 rounded bg-theme/10 text-theme">
                        Loyal Customer
                      </span>
                      <span className="text-tiny px-2 py-1 rounded bg-gray5 text-text3">
                        Premium
                      </span>
                      <span className="text-tiny px-2 py-1 rounded bg-gray5 text-text3">
                        Returning
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Notes</h5>
                    <textarea
                      className="w-full h-24 p-3 border border-gray rounded-md text-sm"
                      placeholder="Add notes about this customer..."
                    ></textarea>
                  </div>
                </>
              )}

              {customer.role === "guest" && (
                <div className="p-4 bg-gray5 rounded-lg">
                  <p className="text-text3 text-sm mb-2">
                    This is a guest user. They haven't created an account yet.
                  </p>
                  <button className="w-full bg-theme text-white py-2 rounded-md hover:bg-themeDark text-sm">
                    Send Account Creation Link
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Order history
          <div>
            {customer.role === "customer" && customer.orders ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Recent Orders</h5>
                  <button className="text-sm text-theme hover:text-themeDark">
                    View All
                  </button>
                </div>

                {/* Mock order items */}
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray rounded-md hover:bg-gray5 transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Order #{(8000 + index).toString()}
                      </span>
                      <span className="text-tiny text-text3">
                        {index === 0
                          ? "2 days ago"
                          : index === 1
                          ? "1 week ago"
                          : "3 weeks ago"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text3">Status</span>
                      <span
                        className={`text-tiny px-2 py-0.5 rounded-full ${
                          index === 0
                            ? "bg-greenLight text-greenDark"
                            : index === 1
                            ? "bg-purple/10 text-purple"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {index === 0
                          ? "Processing"
                          : index === 1
                          ? "Shipped"
                          : "Delivered"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text3">Total</span>
                      <span className="text-sm font-medium">
                        ${(120 - index * 15).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                {customer.orders > 3 && (
                  <div className="text-center">
                    <button className="text-sm text-theme hover:text-themeDark">
                      Load More Orders
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-text3">
                <p>No order history available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerContext;
