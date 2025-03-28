import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }
  await dbConnect();

  const task = await Task.findById(id);
  return NextResponse.json(task);
}

export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }
  const task = await Task.findByIdAndDelete(id);
  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: { params: any }) {
  await dbConnect();
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }
  const body = await request.json();
  const task = await Task.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(task);
}